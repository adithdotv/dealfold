from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    serpapi_api_key: str
    serpapi_gl: str = "in"
    serpapi_hl: str = "en"
    serpapi_location: str = "India"
    # Comma-separated frontend origins allowed to call the API.
    allowed_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def allowed_origin_list(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
