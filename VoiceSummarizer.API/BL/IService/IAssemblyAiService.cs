﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.IService
{
    public interface IAssemblyAiService
    {
        Task<string> SummarizeFromAudioUrlAsync(string audioUrl);
    }
}
