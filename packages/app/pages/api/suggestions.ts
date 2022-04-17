import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q } = req.query;
  const data = await fetch(
    `https://www.npmjs.com/search/suggestions?q=${q as string}`
  ).then(res => res.json());
  res.status(200).json(
    data.map(({ name, scope, version, date }) => ({
      name,
      scope,
      version,
      date,
    }))
  );
};
