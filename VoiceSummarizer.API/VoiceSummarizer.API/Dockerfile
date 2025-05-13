## שלב 1: build
#FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
#WORKDIR /app
#
## העתקת הסולושן והפרויקטים
#COPY VoiceSummarizer.API.sln ./
#COPY DL/DL.csproj ./DL/
#COPY BL/BL.csproj ./BL/
#COPY VoiceSummarizer.API/VoiceSummarizer.API.csproj ./VoiceSummarizer.API/
#
## Restore התלויות
#RUN dotnet restore
#
## העתקת שאר קבצי הקוד
#COPY . .
#
## בניית הפרויקט
#RUN dotnet publish VoiceSummarizer.API/VoiceSummarizer.API.csproj -c Release -o out
#
## שלב 2: runtime
#FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
#WORKDIR /app
#COPY --from=build /app/out .
#
## הפעלת השרת
#ENTRYPOINT ["dotnet", "VoiceSummarizer.API.dll"]
#


# syntax=docker/dockerfile:1

# שלב הבנייה
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build

WORKDIR /source

COPY . . 

WORKDIR /source/VoiceSummarizer.API

ARG TARGETARCH

RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish -c Release -a ${TARGETARCH/amd64/x64} --use-current-runtime --self-contained false -o /app

# שלב ההרצה
FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS final

WORKDIR /app

COPY --from=build /app .

# יצירת משתמש לא-שורש
RUN adduser -D appuser
USER appuser

# חשיפת הפורט והגדרת ASPNETCORE_URLS ל-HTTP על פורט 80
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

# קביעת הפקודה להרצה
ENTRYPOINT ["dotnet", "VoiceSummarizer.API.dll"]
