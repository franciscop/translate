declare module "translate" {
  function translate(
    text: string,
    opts?: {
      from?: string;
      to?: string;
      cache?: undefined;
      languages?: Function;
      engines?: Function;
      engine?: "google" | "deepl" | "libre" | "yandex";
      keys?: object;
    }
  ): Promise<any>;

  export = translate;
}
