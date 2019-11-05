import React, {
  useState,
  useEffect
} from 'react';

import readingTime from 'reading-time';

//* MUI
import Snackbar from '@material-ui/core/Snackbar';
import {
  ThemeProvider
} from '@material-ui/core/styles';
import theme from './utils/theme';
import {
  auth,
  firestore
} from './firebase';

//* Components
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import DialogHost from './components/Dialog/DialogHost';

//* Pages
import Routes from './pages/Routes';

//* Context
import PatientContextProvider from './context/patient/PatientContext';
import AlertContextProvider from './context/alert/AlertContext';

// Blockchain
import getWeb3 from "./utils/getWeb3.js";

import MedChainContract from "./contracts/med_chain.json";


async function getBlock() {
  try {

    var data = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null
    }
    console.log("its going");
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = MedChainContract.networks[networkId];
    const instance = new web3.eth.Contract(
      MedChainContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    const cont = instance;
    data.accounts = accounts;
    data.web3 = web3;
    data.contract = instance;
    return data;
  } catch (error) {
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }
};

async function example(data) {
  console.log(data.accounts);
  console.log(data.accounts[0]);
  data.contract.address = data.accounts[0];
  await data.contract.methods.add_paitent(19, 20, "Krishna", "7/11/1998", 40, "Male", "None").send({
    from: data.accounts[0]
  });
  const response = await data.contract.methods.lookup_paitent(19).call();
  console.log(response);
}


function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [performingAction, setPerformingAction] = useState(false);
  const [dialog, setDialog] = useState({
    signUpDialog: false,
    signInDialog: false,
    settingsDialog: false,
    signOutDialog: false,
    deleteAccountDialog: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    autoHideDuration: 0,
    message: '',
  });

  useEffect(() => {

    getBlock().then(function (data) {
      example(data);
    });

    const removeAuthStateChangedObserver = auth.onAuthStateChanged(user => {
      //* if there is no user...
      if (!user) {
        setUser(null);
        setUserData(null);
        setSignedIn(false);
        setReady(true);
        return;
      }

      const {
        uid
      } = user;

      //* if there is no uid...
      if (!uid) {
        setUser(null);
        setUserData(null);
        setSignedIn(false);
        setReady(true);
        return;
      }

      const reference = firestore.collection('users').doc(uid);

      //* if there is no reference...
      if (!reference) {
        setUser(null);
        setUserData(null);
        setSignedIn(false);
        setReady(true);
        return;
      }

      const removeReferenceListener = reference.onSnapshot(snapshot => {
        if (!snapshot.exists) {
          if (removeReferenceListener) {
            removeReferenceListener();
          }
          setUser(null);
          setUserData(null);
          setSignedIn(false);
          setReady(true);
          return;
        }

        const data = snapshot.data();

        if (!data) {
          if (removeReferenceListener) {
            removeReferenceListener();
          }

          setUser(null);
          setUserData(null);
          setSignedIn(false);
          setReady(true);
          return;
        }

        setUser(user);
        setUserData(data);
        setSignedIn(true);
        setReady(true);
      });
    });

    return () => {
      if (removeAuthStateChangedObserver) {
        removeAuthStateChangedObserver();
      }
    };
  }, []);

  const openSnackbar = (message, autoHideDuration = 2) => {
    setSnackbar({
      open: true,
      message,
      autoHideDuration: readingTime(message).time * autoHideDuration,
    });
  };

  return ( <
    PatientContextProvider >
    <
    AlertContextProvider >
    <
    ThemeProvider theme = {
      theme
    } > {
      !ready && < Loading / >
    } {
      ready && ( <
        >
        <
        Navbar signedIn = {
          signedIn
        }
        performingAction = {
          performingAction
        }
        user = {
          user
        }
        userData = {
          userData
        }
        onSignUpClick = {
          () =>
          setDialog({
            ...dialog,
            signUpDialog: true
          })
        }
        onSignInClick = {
          () =>
          setDialog({
            ...dialog,
            signInDialog: true
          })
        }
        onSettingsClick = {
          () =>
          setDialog({
            ...dialog,
            settingsDialog: true
          })
        }
        onSignOutClick = {
          () =>
          setDialog({
            ...dialog,
            signOutDialog: true
          })
        }
        />

        <
        Routes signedIn = {
          signedIn
        }
        />

        <
        DialogHost signedIn = {
          signedIn
        }
        dialogs = {
          {
            signUpDialog: {
              dialogProps: {
                open: dialog.signUpDialog,
                onClose: () =>
                  setDialog({
                    ...dialog,
                    signUpDialog: false
                  }),
              },

              props: {
                performingAction,
                openSnackbar: message => openSnackbar(message),
              },
            },

            signInDialog: {
              dialogProps: {
                open: dialog.signInDialog,
                onClose: () =>
                  setDialog({
                    ...dialog,
                    signInDialog: false
                  }),
              },

              props: {
                performingAction,
                openSnackbar: message => openSnackbar(message),
              },
            },

            settingsDialog: {
              dialogProps: {
                open: dialog.settingsDialog,
                onClose: () =>
                  setDialog({
                    ...dialog,
                    settingsDialog: false
                  }),
              },

              props: {
                user,
                userData: userData, // eslint-disable-line
                theme,
                openSnackbar: message => openSnackbar(message),
                onDeleteAccountClick: () =>
                  setDialog({
                    ...dialog,
                    deleteAccountDialog: false
                  }),
              },
            },

            deleteAccountDialog: {
              dialogProps: {
                open: dialog.deleteAccountDialog,
                onClose: () =>
                  setDialog({
                    ...dialog,
                    deleteAccountDialog: false
                  }),
              },

              props: {
                performingAction,
                userData: userData, // eslint-disable-line
                openSnackbar: message => openSnackbar(message),
              },
            },

            signOutDialog: {
              dialogProps: {
                open: dialog.signOutDialog,
                onClose: () =>
                  setDialog({
                    ...dialog,
                    signOutDialog: false
                  }),
              },

              props: {
                performingAction,
              },
            },
          }
        }
        />

        <
        Snackbar open = {
          snackbar.open
        }
        autoHideDuration = {
          snackbar.autoHideDuration
        }
        message = {
          snackbar.message
        }
        onClose = {
          () => setSnackbar({
            open: false
          })
        }
        /> <
        />
      )
    } <
    /ThemeProvider> <
    /AlertContextProvider> <
    /PatientContextProvider>
  );
}

export default App;