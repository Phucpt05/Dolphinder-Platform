import {
  useConnectWallet,
  useCurrentAccount,
  useDisconnectWallet,
  useWallets,
} from "@mysten/dapp-kit";
import { useModalStore } from "../../store/useModalStore";
import { Button } from "../shared/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../providers/ToastProvider";
import { AuthProvider, EnokiWallet, isEnokiWallet } from "@mysten/enoki";

const ConnectBtn = () => {
  const { open } = useModalStore();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const account = useCurrentAccount();
  const { success } = useToast();

  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-sm border border-white/20">
          <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer">
            <a href={`/profile/${account.address}`} className="flex items-center gap-2 w-full">
              <span className="text-blue-400">👤</span> Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer">
            <p className="flex items-center gap-2 w-full" onClick={() => {
              disconnectWallet(undefined, {
                onSuccess: () => {
                  success('Wallet disconnected successfully!');
                }
              });
            }}>
              <span className="text-red-400">🔌</span> Disconnect
            </p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => open({ content: <ConnectModal /> })}>Connect</Button>
  );
};

const ConnectModal = () => {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { close } = useModalStore();
  const { success, error } = useToast();

  const enokiWallets = useWallets().filter(isEnokiWallet)
  const walletsByProvider = enokiWallets.reduce(
		(map, enokiWallet) => map.set(enokiWallet.provider, enokiWallet),
		new Map<AuthProvider, EnokiWallet>(),
	);
  const googleWallet = walletsByProvider.get('google');
  
  if (currentAccount) {
		return <div>Current address: {currentAccount.address}</div>;
	}
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">Connect your wallet</h1>

      <div className="mt-4 flex flex-col gap-2">
        {wallets.map(wallet => (
          <Button
            onClick={() => {
              connect(
                { wallet },
                {
                  onSuccess: () => {
                    success(`Connected to ${wallet.name} successfully!`);
                    close();
                  },
                  onError: (connectError: Error) => {
                    error(`Failed to connect to ${wallet.name}: ${connectError.message}`);
                  },
                }
              );
            }}
            key={wallet.name}
            className="flex items-center gap-2 px-2"
          >
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="size-12 rounded-full"
            />
            {wallet.name}
          </Button>
        ))}
      </div>
      <div>
        {googleWallet ? (
				<button
					onClick={() => {
						connect({ wallet: googleWallet });
					}}
				>
					Sign in with Google
				</button>
			) : null}
      </div>
    </div>
  );
};

export default ConnectBtn;
