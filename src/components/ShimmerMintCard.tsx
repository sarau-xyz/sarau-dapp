import React from "react";
import { Card } from "reactstrap";
import Skeleton from "react-loading-skeleton";

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
      <Skeleton height={24} width={300} />
      {Spacing(10)}
      <Skeleton height={20} width={100} />
      {Spacing(10)}
      <div className="mx-auto">
        <Skeleton height={200} width={200} />
      </div>
      {Spacing(10)}
      <Skeleton height={20} width={100} />
      {Spacing(10)}
      <Skeleton height={20} width={300} />
      {Spacing(10)}
      <Skeleton height={38} width={450} />
      {Spacing(10)}
      <div className="mx-auto">
        <Skeleton height={20} width={300} />
      </div>
    </Card>
  );
};

export default ShimmerMintCard;
