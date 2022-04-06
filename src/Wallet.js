import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import { Box, ThemeProvider, createTheme } from "@mui/system";

const theme = createTheme({
  palette: {
    background: {
      paper: "#fff",
    },
    text: {
      primary: "#173A5E",
      secondary: "#46505A",
    },
    action: {
      active: "#001E3C",
    },
    success: {
      dark: "#009688",
    },
  },
});

const WalletEther = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect wallet");

  const ConnectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0]);
        });
    } else {
      setErrorMessage("Install Metamask");
    }
  };
  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount);
  };
  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  const SendEth = (sender, receiver, amount) => {
    const gasPrice = "0x5208";
    const amountHex = (amount * Math.pow(10, 18)).toString(16);
    const tx = {
      from: sender,
      to: receiver,
      value: amountHex,
      gas: gasPrice,
    };
    return window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
  };

  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    SendEth(defaultAccount, sendAddress, sendAmount);
  };

  window.ethereum.on("accountsChanged", function (accounts) {
    setDefaultAccount(accounts);
    getUserBalance(accounts);
  });
  useEffect(() => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        accountChangeHandler(result[0]);
      });
  });
  return (
    <div className="walletCard container">
      <div className="content-center brand">
        <Typography
          variant="h4"
          component="h4"
          sx={{ p: 3, color: "warning.main" }}
        >
          {"Connection to Metamask!"}
        </Typography>
        {defaultAccount === null && (
          <Button variant="contained" onClick={ConnectWalletHandler}>
            {connButtonText}
          </Button>
        )}
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box sx={{ color: "text.secondary" }}>{defaultAccount}</Box>
            <Box
              sx={{ color: "text.primary", fontSize: 34, fontWeight: "medium" }}
            >
              {userBalance !== null && userBalance + " ETH"}
            </Box>
          </Box>
        </ThemeProvider>

        {errorMessage}
      </div>
      {defaultAccount !== null && (
        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            color="warning"
            sx={{ mt: 2 }}
            value={sendAddress}
            onChange={(e) => setSendAddress(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Amount(ETH)"
            variant="outlined"
            color="warning"
            sx={{ m: 2 }}
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />
          <Button variant="contained" type="submit" sx={{ mt: 2, p: 2 }}>
            Send
          </Button>
        </form>
      )}
    </div>
  );
};

export default WalletEther;
