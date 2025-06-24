using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BL.DTOs;
using DL.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace BL
{
    public class AppMappingProfile : Profile
    {
        public AppMappingProfile()
        {
            CreateMap<User, UserResponseDto>();
            CreateMap<UserCreateDto, User>();
            CreateMap<User,AuthResponseDto>();
            CreateMap<UserUpdateDto, User>()
           .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));


            //CreateMap<UserFile, UserFileResponseDto>();
            CreateMap<UserFile, UserFileResponseDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Name))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.SummaryContent, opt => opt.MapFrom(src => src.Summary != null ? src.Summary.Content : null))
            .ForMember(dest => dest.SummaryId, opt => opt.MapFrom(src => src.SummaryId));


            CreateMap<UserFileCreateDto, UserFile>();
            CreateMap<UserFileUpdateDto, UserFile>()
           .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            


            CreateMap<Category, CategoryResponseDto>();
            CreateMap<CategoryCreateDto, Category>();


            CreateMap<Summary, SummaryResponseDto>();
            CreateMap<SummaryCreateDto, Summary>();
            CreateMap<SummaryUpdateDto, Summary>()
           .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        }
    }

}
