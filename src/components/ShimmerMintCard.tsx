import React from "react";
import { Card } from "reactstrap";
import { Shimmer } from "react-shimmer";

const ShimmerMintCard: React.FC = () => {
  const Spacing = (height: number) => <div style={{ height }} />;

  return (
    <Card
      style={{
        maxWidth: 500,
      }}
      className="mx-auto border-0 shadow"
      body
    >
      <Shimmer height={24} width={300} />
      {Spacing(10)}
      <Shimmer height={20} width={100} />
      {Spacing(10)}
      <Shimmer height={200} width={200} className="mx-auto" />
      {Spacing(10)}
      <Shimmer height={20} width={100} />
      {Spacing(10)}
      <Shimmer height={20} width={300} />
      {Spacing(10)}
      <Shimmer height={38} width={450}  />
      {Spacing(10)}
      <Shimmer height={20} width={300} className="mx-auto" />
    </Card>
  );
};

export default ShimmerMintCard;
