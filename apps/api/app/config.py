from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    serpapi_api_key: str
    serpapi_gl: str = "in"
    serpapi_hl: str = "en"
    serpapi_location: str = "India"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()