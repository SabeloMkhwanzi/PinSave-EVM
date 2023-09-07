import { Button } from "@mantine/core";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function LoginButton() {
  const { connect, connectors } = useConnect();

  const onClick = async () => {
    await connect({ connector: connectors[0] });
  };

  return <Button onClick={onClick}>Login</Button>;
}

function LogoutButton() {
  const { disconnect } = useDisconnect();

  const onClick = async () => {
    await disconnect();
  };

  return <Button onClick={onClick}>Logout</Button>;
}
export function UauthButton() {
  const { address } = useAccount();
  if (address) {
    return <LogoutButton />;
  }
  return <LoginButton />;
}
