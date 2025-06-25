using BL.IService;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

        public async Task<string> SummarizeFromAudioUrlAsync(string audioUrl)
        {
            _logger.LogInformation("[SummarizeFromAudioUrlAsync] Starting summarization for audio URL: {AudioUrl}", audioUrl);

            if (string.IsNullOrEmpty(audioUrl))
            {
                _logger.LogError("[SummarizeFromAudioUrlAsync] Audio URL is null or empty");
                throw new ArgumentException("Audio URL cannot be null or empty");
            }

            var payload = new
            {
                audio_url = audioUrl,
                summarization = true,
                summary_type = "bullets",       // יכול להיות גם "gist" או "headline"
                summary_model = "informative",   // זה מה שהיה חסר!
                language = "he"  // קוד שפה לעברית
            };

            var json = JsonConvert.SerializeObject(payload);
            _logger.LogInformation("[SummarizeFromAudioUrlAsync] Payload created: {Payload}", json);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _logger.LogInformation("[SummarizeFromAudioUrlAsync] Sending POST request to AssemblyAI");
            var response = await _httpClient.PostAsync("https://api.assemblyai.com/v2/transcript", content);

            _logger.LogInformation("[SummarizeFromAudioUrlAsync] POST response received. Status: {StatusCode}", response.StatusCode);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("[SummarizeFromAudioUrlAsync] POST request failed. Status: {StatusCode}, Error: {ErrorContent}",
                    response.StatusCode, errorContent);
                throw new Exception($"AssemblyAI POST failed: {response.StatusCode} - {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("[SummarizeFromAudioUrlAsync] POST response content: {ResponseContent}", responseContent);

            var result = JsonConvert.DeserializeObject<JObject>(responseContent);
            var transcriptId = result["id"]?.ToString();

            if (string.IsNullOrEmpty(transcriptId))
            {
                _logger.LogError("[SummarizeFromAudioUrlAsync] No transcript ID received from AssemblyAI");
                throw new Exception("No transcript ID received from AssemblyAI");
            }

            _logger.LogInformation("[SummarizeFromAudioUrlAsync] Transcript ID received: {TranscriptId}", transcriptId);
            _logger.LogInformation("[SummarizeFromAudioUrlAsync] Starting polling for transcript completion");

            int pollCount = 0;
            while (true)
            {
                pollCount++;
                _logger.LogInformation("[SummarizeFromAudioUrlAsync] Polling attempt #{PollCount} - waiting 3 seconds", pollCount);

                await Task.Delay(3000);

                _logger.LogInformation("[SummarizeFromAudioUrlAsync] Sending GET request for transcript status");
                var pollingResponse = await _httpClient.GetAsync($"https://api.assemblyai.com/v2/transcript/{transcriptId}");

                _logger.LogInformation("[SummarizeFromAudioUrlAsync] GET response received. Status: {StatusCode}", pollingResponse.StatusCode);

                if (!pollingResponse.IsSuccessStatusCode)
                {
                    var errorContent = await pollingResponse.Content.ReadAsStringAsync();
                    _logger.LogError("[SummarizeFromAudioUrlAsync] GET request failed. Status: {StatusCode}, Error: {ErrorContent}",
                        pollingResponse.StatusCode, errorContent);
                    throw new Exception($"AssemblyAI GET failed: {pollingResponse.StatusCode} - {errorContent}");
                }

                var pollingContent = await pollingResponse.Content.ReadAsStringAsync();
                _logger.LogInformation("[SummarizeFromAudioUrlAsync] GET response content: {ResponseContent}", pollingContent);

                var pollingJson = JsonConvert.DeserializeObject<JObject>(pollingContent);
                var status = pollingJson["status"]?.ToString();

                _logger.LogInformation("[SummarizeFromAudioUrlAsync] Current transcript status: {Status}", status);

                if (status == "completed")
                {
                    var summary = pollingJson["summary"]?.ToString() ?? "";
                    _logger.LogInformation("[SummarizeFromAudioUrlAsync] Transcript completed successfully. Summary length: {SummaryLength}",
                        summary.Length);

                    if (string.IsNullOrEmpty(summary))
                    {
                        _logger.LogWarning("[SummarizeFromAudioUrlAsync] Summary is empty or null");
                        // נבדוק אם יש תמלול רגיל במקום
                        var transcript = pollingJson["text"]?.ToString();
                        if (!string.IsNullOrEmpty(transcript))
                        {
                            _logger.LogInformation("[SummarizeFromAudioUrlAsync] No summary available, but transcript exists. Transcript length: {TranscriptLength}",
                                transcript.Length);
                        }
                    }

                    return summary;
                }
                else if (status == "error")
                {
                    var error = pollingJson["error"]?.ToString();
                    _logger.LogError("[SummarizeFromAudioUrlAsync] Transcript processing failed with error: {Error}", error);
                    throw new Exception($"AssemblyAI processing failed: {error}");
                }
                else if (status == "processing" || status == "queued")
                {
                    _logger.LogInformation("[SummarizeFromAudioUrlAsync] Transcript still {Status}, continuing to poll...", status);

                    // הוסף timeout למניעת loop אינסופי
                    if (pollCount > 100) // 5 דקות בערך
                    {
                        _logger.LogError("[SummarizeFromAudioUrlAsync] Polling timeout reached after {PollCount} attempts", pollCount);
                        throw new Exception($"AssemblyAI processing timeout after {pollCount} polling attempts");
                    }
                }
                else
                {
                    _logger.LogWarning("[SummarizeFromAudioUrlAsync] Unknown status received: {Status}", status);
                }
            }
        }
    }
}