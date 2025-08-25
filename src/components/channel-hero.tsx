import { format } from "date-fns";

type Props = {
  name: string;
  creationTime: number;
};

export function ChannelHero({ name, creationTime }: Props) {
  return (
    <div className="mt-[50px] mx-5 mb-4">
      <h2 className="text-2xl font-bold flex items-center mb-2"># {name}</h2>
      <p className="font-normal text-slate-800 mb-4">
        This channel was created on {format(creationTime, "MMM do, yyyy")}. This
        is the very beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
}
