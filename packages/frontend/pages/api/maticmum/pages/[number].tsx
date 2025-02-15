import { parseCid } from "@/services/parseCid";
import { getContractInfo } from "@/utils/contracts";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { number } = req.query;
    const pageNumber = Number(number) + 1;

    const { address, abi } = getContractInfo(80001);
    let provider = new ethers.providers.AlchemyProvider(
      "maticmum",
      process.env.NEXT_ALCHEMY_ID
    );

    const contract = new ethers.Contract(address, abi, provider);

    const totalSupply = ethers.BigNumber.from(
      await contract.totalSupply()
    ).toNumber();

    let items = [];
    let result;

    var upperLimit = 6 * pageNumber;

    const lowerLimit = upperLimit - 6 + 1;

    if (totalSupply < upperLimit) {
      upperLimit = totalSupply;
    }

    for (let i = lowerLimit; upperLimit >= i; i++) {
      result = await contract.tokenURI(i);

      let resURL;
      if (result) {
        if (result.charAt(0) === "i") {
          resURL = "https://ipfs.io/ipfs/" + parseCid(result);
        }
        if (result.charAt(0) === "h") {
          resURL = result;
        }
      }

      const item = await fetch(resURL).then((x) => x.json());

      items.push({ token_id: i, ...item });
    }

    res.status(200).json({ items: items, totalSupply: totalSupply });
  } catch (err) {
    res.status(500).json({ error: "failed to fetch data" + err });
  }
}
