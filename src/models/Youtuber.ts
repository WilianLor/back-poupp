import { Schema, model } from "mongoose";

interface YoutuberInterface {
  channelId: string;
  title: string;
  picture: string;
}

const YoutuberSchema = new Schema<YoutuberInterface>({
  channelId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
});

const Youtuber = model<YoutuberInterface>("Youtuber", YoutuberSchema);
export default Youtuber;
