using BL.IService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace BL.Services
{
    public class AssemblyAiService : IAssemblyAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<AssemblyAiService> _logger;

        public AssemblyAiService(HttpClient httpClient, IConfiguration config, ILogger<AssemblyAiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = config["AssemblyAI:ApiKey"] ?? throw new ArgumentNullException("AssemblyAI:ApiKey not found");

            _logger.LogInformation("[AssemblyAiService] Initializing with API key: {ApiKeyMasked}",
                string.IsNullOrEmpty(_apiKey) ? "NULL" : $"***{_apiKey.Substring(Math.Max(0, _apiKey.Length - 4))}");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> TranscribeFromAudioUrlAsync(string audioUrl)
        {
            _logger.LogInformation("[TranscribeFromAudioUrlAsync] Starting transcription for audio URL: {AudioUrl}", audioUrl);

            if (string.IsNullOrEmpty(audioUrl))
                throw new ArgumentException("Audio URL cannot be null or empty");

            // שלב 1: שליחת בקשת תמלול בלבד
            var transcriptPayload = new
            {
                audio_url = audioUrl,
                language_code = "he"
            };

            var transcriptContent = new StringContent(JsonConvert.SerializeObject(transcriptPayload), Encoding.UTF8, "application/json");
            var transcriptResponse = await _httpClient.PostAsync("https://api.assemblyai.com/v2/transcript", transcriptContent);

            if (!transcriptResponse.IsSuccessStatusCode)
            {
                var error = await transcriptResponse.Content.ReadAsStringAsync();
                throw new Exception($"Failed to start transcription: {error}");
            }

            var transcriptJson = JsonConvert.DeserializeObject<JObject>(await transcriptResponse.Content.ReadAsStringAsync());
            var transcriptId = transcriptJson["id"]?.ToString();

            if (string.IsNullOrEmpty(transcriptId))
                throw new Exception("No transcript ID returned from AssemblyAI");

            _logger.LogInformation("Transcript ID: {TranscriptId}", transcriptId);

            // שלב 2: המתנה לתמלול בלבד
            string status = "";
            JObject pollingJson = null;
            int pollCount = 0;

            do
            {
                await Task.Delay(3000);
                var pollingResponse = await _httpClient.GetAsync($"https://api.assemblyai.com/v2/transcript/{transcriptId}");
                if (!pollingResponse.IsSuccessStatusCode)
                {
                    var error = await pollingResponse.Content.ReadAsStringAsync();
                    throw new Exception($"Polling failed: {error}");
                }

                var pollingContent = await pollingResponse.Content.ReadAsStringAsync();
                pollingJson = JsonConvert.DeserializeObject<JObject>(pollingContent);
                status = pollingJson["status"]?.ToString();
                pollCount++;

                if (pollCount > 100)
                    throw new Exception("Polling timed out after 5 minutes");

            } while (status == "queued" || status == "processing");

            if (status == "error")
            {
                var error = pollingJson["error"]?.ToString();
                throw new Exception($"Transcription failed: {error}");
            }

            _logger.LogInformation("Transcription completed");

            // שלב 3: שליפת הטקסט המתומלל
            var transcriptText = pollingJson["text"]?.ToString();

            if (string.IsNullOrEmpty(transcriptText))
                throw new Exception("Transcription result is empty");

            return transcriptText;
        }
    }
}
