import axios, { AxiosResponse } from "axios";

export async function request(url: string): Promise<string> {
  try {
    const res: AxiosResponse = await axios.get(url);
    return res.data;
  } catch (err) {
    if (err.isAxiosError) {
      console.error(`REQUEST ERROR: ${err.code}`);
    } else {
      console.error(`ERROR: ${err.name}`);
    }
    console.error(err.stack);
    throw err;
  }
}
