import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { FetchWeatherData } from "./FetchWeatherData";

interface FormData {
  country: string;
}

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

export const CountryWeatherData = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const FetchData = async (countryName: string) => {
    try {
      const res = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=4286ce4ecb7e0715be8c945ab241d674&units=metric`
      );

      if (!res.status) throw new Error(`${error}`);
      setData(res.data);
      setError(""); // Clear previous error
    } catch (err) {
      const message = (err as AxiosError).message;
      setError(message);
      setData(null); // clear old data
    }
  };

  const onSubmit = (data: FormData) => {
    FetchData(data.country);

    reset();
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-purple-900 p-5">
      <div className="w-full items-center justify-center flex my-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row gap-5 items-center"
        >
          <div>
            <input
              type="text"
              placeholder="Country"
              {...register("country", { required: true })}
              className="sm:w-xs border-2 p-2 px-4 text-white rounded-full text-2xl"
            />
            {errors.country && (
              <p className="text-red-600">This field requires a country name</p>
            )}
          </div>
          <Button
            type="submit"
            className="max-sm:px-10 max-sm:rounded-full text-base"
          >
            Submit
          </Button>
        </form>
      </div>

      {data ? (
        <div>
          <Button
            onClick={() => setData(null)}
            type="button"
            className="bg-transparent p-3 rounded-full border-2 text-white mb-2"
          >
            X
          </Button>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>{data.name}</CardTitle>
              <Badge variant="outline">{data.weather[0].main}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-2xl font-semibold">{data.main.temp}°C</p>
                  <p className="text-sm text-muted-foreground">
                    Feels like: {data.main.feels_like}°C
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <p className="text-sm">Pressure: {data.main.pressure} hPa</p>
              <p className="text-sm">Wind Speed: {data.wind.speed} m/s</p>
              <p className="text-sm">Wind Direction: {data.wind.deg}°</p>
              <p className="text-sm capitalize mt-2">
                Description: {data.weather[0].description}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <FetchWeatherData />
      )}
    </div>
  );
};
