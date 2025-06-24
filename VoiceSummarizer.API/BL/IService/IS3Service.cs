using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.IService
{
    public interface IS3Service
    {
        string GeneratePresignedUrl(string fileName, string contentType);
    }
}
