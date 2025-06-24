using BL.IService;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BL.Services
{
    public class AssemblyAiService : IAssemblyAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AssemblyAiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["AssemblyAI:ApiKey"] ?? throw new ArgumentNullException("AssemblyAI:ApiKey not found");

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> SummarizeFromAudioUrlAsync(string audioUrl)
        {
            var payload = new
            {
                audio_url = audioUrl,
                summarization = true,
                summary_type = "bullets",       // יכול להיות גם "gist" או "headline"
                summary_model = "informative",   // זה מה שהיה חסר!
                language = "he"  // קוד שפה לעברית
            };

            var json = JsonConvert.SerializeObject(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.assemblyai.com/v2/transcript", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[AssemblyAI] Error: {response.StatusCode}, Body: {errorContent}");
                throw new Exception($"AssemblyAI POST failed: {response.StatusCode}");
            }

            var result = JsonConvert.DeserializeObject<JObject>(await response.Content.ReadAsStringAsync());
            var transcriptId = result["id"]?.ToString();

            while (true)
            {
                await Task.Delay(3000);
                var pollingResponse = await _httpClient.GetAsync($"https://api.assemblyai.com/v2/transcript/{transcriptId}");

                if (!pollingResponse.IsSuccessStatusCode)
                {
                    var errorContent = await pollingResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"[AssemblyAI] Polling error: {pollingResponse.StatusCode}, Body: {errorContent}");
                    throw new Exception($"AssemblyAI GET failed: {pollingResponse.StatusCode}");
                }

                var pollingJson = JsonConvert.DeserializeObject<JObject>(await pollingResponse.Content.ReadAsStringAsync());
                var status = pollingJson["status"]?.ToString();

                if (status == "completed")
                {
                    return pollingJson["summary"]?.ToString() ?? "";
                }
                else if (status == "error")
                {
                    var error = pollingJson["error"]?.ToString();
                    Console.WriteLine($"[AssemblyAI] Processing error: {error}");
                    throw new Exception("AssemblyAI failed: " + error);
                }
            }
        }
    }
}
