// Own libraries
import { db, fireStore } from './firebase.js';
import { importAESKey, AESEncrypt } from './crypto.js';

const { addDoc, deleteDoc, updateDoc, collection, doc } = fireStore;


export const createPassword = async (user, folderId, passwordDocument, folderKey, userPrivateKey) => {
    const decryptedFolderKey = await importAESKey(folderKey, userPrivateKey);

    // Encrypt username and password
    const username = await AESEncrypt(passwordDocument.username, decryptedFolderKey);
    const password = await AESEncrypt(passwordDocument.password, decryptedFolderKey);

    const subcollectionRef = collection(db, "folders", folderId, "passwords");

    let docRef = await addDoc(subcollectionRef, {...passwordDocument, username, password, owner: user.uid});

    return docRef;
}

export const deletePassword = (folderId, passwordId) => {
    const docRef = doc(db, "folders", folderId, "passwords", passwordId);
    deleteDoc(docRef);
}

export const editPassword = (folderId, passwordId,  password) => {
    const docRef = doc(db, "folders", folderId, "passwords", passwordId);

    updateDoc(docRef, password);
}