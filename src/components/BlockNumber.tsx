import { useBlockNumber } from "wagmi";

export const BlockNumber = () => {
  const { data, isError, isLoading } = useBlockNumber();

  if (isLoading) return <div>Fetching block number…</div>;
  if (isError) return <div>Error fetching block number</div>;
  return <div>Block number: {data}</div>;
};
