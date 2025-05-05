/**
 * Weather data model for Mars
 * This would be used if we were implementing a database schema
 * For DynamoDB, we don't need a strict schema, but this serves as documentation
 */
class MarsWeather {
  constructor(data) {
    this.id = data.id || `weather-${Date.now()}`;
    this.sol = data.sol;
    this.date = data.date;
    this.temperature = {
      average: data.temperature?.average,
      min: data.temperature?.min,
      max: data.temperature?.max,
    };
    this.windSpeed = {
      average: data.windSpeed?.average,
      min: data.windSpeed?.min,
      max: data.windSpeed?.max,
    };
    this.pressure = {
      average: data.pressure?.average,
      min: data.pressure?.min,
      max: data.pressure?.max,
    };
    this.season = data.season;
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  /**
   * Validates the weather data
   * @returns {boolean} Whether the data is valid
   */
  isValid() {
    return (
      this.sol &&
      this.date &&
      this.temperature &&
      this.windSpeed &&
      this.pressure &&
      this.season
    );
  }

  /**
   * Converts the model to a plain object for storage
   * @returns {Object} Plain object representation
   */
  toObject() {
    return {
      id: this.id,
      sol: this.sol,
      date: this.date,
      temperature: this.temperature,
      windSpeed: this.windSpeed,
      pressure: this.pressure,
      season: this.season,
      timestamp: this.timestamp,
    };
  }
}

module.exports = MarsWeather;