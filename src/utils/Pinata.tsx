//require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

if (!key || !secret) {
    throw new Error("API key and secret must be defined in environment variables");
}

// Definir tipos para las respuestas y los parámetros
interface IPFSResponse {
    success: boolean;
    pinataURL?: string;
    message?: string;
}

const axios = require('axios');
const FormData = require('form-data');

// Tipo para el cuerpo del JSON que se subirá
export const uploadJSONToIPFS = async (JSONBody: Record<string, unknown>): Promise<IPFSResponse> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    try {
        const response = await axios.post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        });

        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// Definir el tipo para el archivo que se va a subir
export const uploadFileToIPFS = async (file: File): Promise<IPFSResponse> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    const data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    try {
        const response = await axios.post(url, data, {
            maxBodyLength: Infinity, // Usa el valor numérico en lugar de la cadena
            headers: {
                'Content-Type': `multipart/form-data; boundary=${(data as any)._boundary}`, 
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        });

        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error: any) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};
// export const uploadJSONToIPFS = async (JSONBody: Record<string, unknown>): Promise<IPFSResponse> => {
//     const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//     //making axios POST request to Pinata ⬇️
//     return axios 
//         .post(url, JSONBody, {
//             headers: {
//                 pinata_api_key: key,
//                 pinata_secret_api_key: secret,
//             }
//         })
//         .then(function (response: any) {
//            return {
//                success: true,
//                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
//            };
//         })
//         .catch(function (error: any) {
//             console.log(error)
//             return {
//                 success: false,
//                 message: error.message,
//             }

//     });
// };

// export const uploadFileToIPFS = async (file: File): Promise<IPFSResponse> => {    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//     //making axios POST request to Pinata ⬇️
//     console.log("File size:", file.size, "bytes");

//     let data = new FormData();
//     data.append('file', file);

//     const metadata = JSON.stringify({
//         name: 'testname',
//         keyvalues: {
//             exampleKey: 'exampleValue'
//         }
//     });
//     data.append('pinataMetadata', metadata);

//     //pinataOptions are optional
//     const pinataOptions = JSON.stringify({
//         cidVersion: 0,
//         customPinPolicy: {
//             regions: [
//                 {
//                     id: 'FRA1',
//                     desiredReplicationCount: 1
//                 },
//                 {
//                     id: 'NYC1',
//                     desiredReplicationCount: 2
//                 }
//             ]
//         }
//     });
//     data.append('pinataOptions', pinataOptions);

//     return axios 
//         .post(url, data, {
//             maxBodyLength: 'Infinity',
//             headers: {
//                 'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
//                 pinata_api_key: key,
//                 pinata_secret_api_key: secret,
//             }
//         })
//         .then(function (response: any) {
//             console.log("image uploaded", response.data.IpfsHash)
//             return {
//                success: true,
//                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
//            };
//         })
//         .catch(function (error: any) {
//             console.log(error)
//             return {
//                 success: false,
//                 message: error.message,
//             }

//     });
// };