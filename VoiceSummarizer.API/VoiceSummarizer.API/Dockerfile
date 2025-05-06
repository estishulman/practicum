# שלב 1: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# העתקת הסולושן והפרויקטים
COPY VoiceSummarizer.API.sln ./
COPY DL/DL.csproj ./DL/
COPY BL/BL.csproj ./BL/
COPY VoiceSummarizer.API/VoiceSummarizer.API.csproj ./VoiceSummarizer.API/

# Restore התלויות
RUN dotnet restore

# העתקת שאר קבצי הקוד
COPY . .

# בניית הפרויקט
RUN dotnet publish VoiceSummarizer.API/VoiceSummarizer.API.csproj -c Release -o out

# שלב 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# הפעלת השרת
ENTRYPOINT ["dotnet", "VoiceSummarizer.API.dll"]
