import ConnectWallet from "@/components/ConnectWallet";
import { UauthButton } from "@/components/auth/UAuthButton";
import {
  createStyles,
  Text,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Avatar,
  Button,
  TextInput,
  SimpleGrid,
  Tooltip,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
//import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const HEADER_HEIGHT = 90;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.xl,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.lg,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },

  linkLabel: {
    marginRight: 5,
  },

  search: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
    width: "600px",
  },
}));

interface NavbarProps {
  links: { link: string; label: string }[];
}

export function HeaderNav({ links }: NavbarProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes, cx } = useStyles();
  const router = useRouter();
  const items = links.map((link) => (
    <Link key={link.label} href={link.link} passHref>
      <Text
        className={cx(classes.link, {
          [classes.linkActive]: router.asPath === link.link,
        })}
      >
        {link.label}
      </Text>
    </Link>
  ));

  return (
    <Header
      fixed
      height={HEADER_HEIGHT}
      mb={10}
      sx={{ backdropFilter: "blur(5px)", borderBottom: 0 }}
    >
      <Container className={classes.header} fluid>
        <Link href="/">
          <Image
            src="/PinSaveL.png"
            alt="Pin Save EVM"
            width={140}
            height={35}
            className="block lg:hidden h-8 w-auto"
            priority
          />
        </Link>
        <Group spacing={5} className={classes.links}>
          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            href="/"
          >
            <Button variant="default" radius="xl" className={classes.linkLabel}>
              <Text> Home</Text>
            </Button>
          </Link>

          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            href="/upload"
          >
            <Button variant="default" radius="xl" className={classes.linkLabel}>
              <Text> Create Pin</Text>
            </Button>
          </Link>
          <div className="flex items-center justify-center w-1/3 gap-5">
            <TextInput
              variant="default"
              radius="xl"
              size="md"
              className={classes.search}
              type="text"
              //onChange={(e) => search(e.target.value)}
              placeholder="Search"
              width="4xl"
              icon={<IconSearch size="1rem" stroke={1.5} />}
            />
          </div>
        </Group>
        <Group spacing={5} className={classes.links}>
          <ConnectWallet />
          <Tooltip label="profile setting">
            <Link
              style={{ color: "inherit", textDecoration: "inherit" }}
              href="/profile"
            >
              <Avatar className={classes.linkLabel} radius="xl" />
            </Link>
          </Tooltip>
        </Group>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper
              className={classes.dropdown}
              withBorder
              style={styles}
              radius="md"
            >
              {items}
              <Group spacing={5} my={3} mx={2}>
                <ConnectWallet />
                <Tooltip label="User Profile">
                  <Link
                    style={{ color: "inherit", textDecoration: "inherit" }}
                    href="/profile"
                  >
                    <Avatar className={classes.linkLabel} radius="xl" />
                  </Link>
                </Tooltip>
              </Group>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
