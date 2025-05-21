import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  name: string;
  weather: [
    {
      description: string;
      icon?: string;
      main: string;
      id: number;
    }
  ];
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
}

export const FetchWeatherData = () => {
  const [allData, setAllData] = useState<WeatherData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Run all 3 API calls in parallel
        const [res1, res2, res3] = await Promise.all([
          fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=London&appid=4286ce4ecb7e0715be8c945ab241d674&units=metric"
          ),
          fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=Nigeria&appid=4286ce4ecb7e0715be8c945ab241d674&units=metric"
          ),
          fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=China&appid=4286ce4ecb7e0715be8c945ab241d674&units=metric"
          ),
        ]);
        if (!res1.ok || !res2.ok || !res3.ok) {
          throw new Error("Something went wrong. Try again");
        }

        const [data1, data2, data3] = await Promise.all([
          res1.json(),
          res2.json(),
          res3.json(),
        ]);

        const combined = [data1, data2, data3];

        // Save to state
        setAllData(combined);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex justify-center flex-col gap-4 mb-5 sm:flex-row sm:justify-around items-center">
      {allData.map((item, index) => (
        <Card className="w-[350px]" key={index}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <Badge variant="outline">{item.weather[0].main}</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="weather icon"
                className="w-16 h-16"
              />
              <div>
                <p className="text-2xl font-semibold">{item.main.temp}°C</p>
                <p className="text-sm text-muted-foreground">
                  Feels like: {item.main.feels_like}°C
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <p className="text-sm">Pressure: {item.main.pressure} hPa</p>
            <p className="text-sm">Wind Speed: {item.wind.speed} m/s</p>
            <p className="text-sm">Wind Direction: {item.wind.deg}°</p>
            <p className="text-sm capitalize mt-2">
              Description: {item.weather[0].description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
