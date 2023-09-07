/* eslint-disable @next/next/no-img-element */
import { Button, Center, Group, Text } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoWallet } from "react-icons/io5";

export default function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                border: "2px solid red",
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    radius="xl"
                    variant="default"
                    rightIcon={<IoWallet size={"28px"} color="red" />}
                    onClick={openConnectModal}
                  >
                    <Text
                      style={{ letterSpacing: "0.3px" }}
                      color="gray.5"
                      className="ultra"
                    >
                      Connect
                    </Text>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button color="red" radius="xl" onClick={openChainModal}>
                    Wrong network
                  </Button>
                );
              }

              return (
                <Group>
                  <Center onClick={openChainModal}>
                    {chain.hasIcon && (
                      <Center>
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 26, height: 26 }}
                          />
                        )}
                      </Center>
                    )}
                  </Center>
                  <Button
                    radius="xl"
                    variant="default"
                    onClick={openAccountModal}
                    rightIcon={<IoWallet size={"28px"} color="red" />}
                  >
                    <Text
                      style={{ letterSpacing: "0.3px" }}
                      color="gray.5"
                      className="ultra"
                    >
                      {account.displayName}
                    </Text>
                  </Button>
                </Group>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
