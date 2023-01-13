import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { parseCid } from "livepeer/media";

import { getContractInfo } from "@/utils/contracts";
import { Post } from "@/services/upload";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const { address, abi } = getContractInfo(80001);

    let provider = new ethers.providers.AlchemyProvider(
      "maticmum",
      process.env.NEXT_ALCHEMY_ID
    );

    const contract = new ethers.Contract(address, abi, provider);

    const result = await contract.tokenURI(id);
    const owner = await contract.ownerOf(id);

    let resURL;
    if (result) {
      if (result.charAt(0) === "i") {
        resURL = "https://ipfs.io/ipfs/" + parseCid(result)?.id;
      }
      if (result.charAt(0) === "h") {
        resURL = result;
      }
    }

    const item: Post = await fetch(resURL).then((x) => x.json());

    let decoded_image;

    if (item.image) {
      if (item.image.charAt(0) === "i") {
        decoded_image = "https://ipfs.io/ipfs/" + parseCid(item.image)?.id;
      }
      if (item.image.charAt(0) === "h") {
        decoded_image = item.image;
      }
    }

    if (!decoded_image) {
      decoded_image = "https://evm.pinsave.app/PinSaveCard.png";
    }

    const output = {
      ...item,
      owner: owner,
      image: decoded_image,
    };

    res.status(200).json(output);
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
