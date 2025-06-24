using Microsoft.AspNetCore.Mvc;

using Amazon.Extensions.NETCore.Setup;
using Microsoft.Extensions.Options;

namespace VoiceSummarizer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly AWSOptions _awsOptions;

        public TestController(IOptions<AWSOptions> awsOptions)
        {
            _awsOptions = awsOptions.Value;
        }

        [HttpGet("aws-config")]
        public IActionResult GetAwsConfig()
        {
            return Ok(new
            {
                AccessKey = _awsOptions.Credentials?.GetCredentials().AccessKey,
                Region = _awsOptions.Region?.SystemName,
                Profile = _awsOptions.Profile
            });
        }
    }
}

