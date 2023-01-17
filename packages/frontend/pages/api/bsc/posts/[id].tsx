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
    const { address, abi } = getContractInfo(56);

    const provider = new ethers.providers.JsonRpcProvider("https://bscrpc.com");

    const contract = new ethers.Contract(address, abi, provider);

    const result = await contract.getPost(id);
    const owner = await contract.getPostOwner(id);

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
        let ipfsCid = parseCid(item.image)?.id;
        decoded_image = "https://ipfs.io/ipfs/" + ipfsCid;
        const ipfsImageResponse = await fetch(decoded_image);
        if (ipfsImageResponse.status !== 200) {
          decoded_image = "https://w3s.link/" + ipfsCid;
        }
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
