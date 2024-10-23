// import React, { useRef, useState, useEffect } from 'react'
// import { View, Text, Button } from 'react-native'
// import { Audio } from 'expo-av'
// import axios from 'axios'

// // Your BASE_API_URL
// const BASE_API_URL = 'https://careappsstg.azurewebsites.net/api'

// const getAssemblyAIToken = async () => {
//   try {
//     const API_ENDPOINT = `${BASE_API_URL}/voice`
//     const response = await axios.get(`${API_ENDPOINT}/GetUserToken?userId=test`)
//     return response.data['Token']
//   } catch (error) {
//     console.error('Error fetching AssemblyAI token:', error)
//     return null
//   }
// }

// const VoiceTranscriber = () => {
//   const [token, setToken] = useState<string | null>(null)
//   const socket = useRef<WebSocket | null>(null)
//   const recorder = useRef<Audio.Recording | null>(null)
//   const [isRecording, setIsRecording] = useState(false)
//   const [transcript, setTranscript] = useState('')
//   const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null)

//   useEffect(() => {
//     const fetchToken = async () => {
//       const assemblyToken = await getAssemblyAIToken()
//       if (assemblyToken) {
//         setToken(assemblyToken)
//       }
//     }
//     fetchToken()
//   }, [])

//   const generateTranscript = async () => {
//     if (!token) {
//       console.error('No token found')
//       return
//     }
  
//     // If there's an ongoing recording, stop it before starting a new one
//     if (recorder.current) {
//       try {
//         await recorder.current.stopAndUnloadAsync()
//         recorder.current = null // Ensure the current recording object is cleared
//       } catch (error) {
//         console.error('Failed to stop previous recording:', error)
//       }
//     }
  
//     socket.current = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`)
  
//     const texts: Record<number, string> = {}
//     socket.current.onmessage = (voicePrompt: MessageEvent) => {
//       let msg = ''
//       const res = JSON.parse(voicePrompt.data)
//       texts[res.audio_start] = res.text
//       const keys = Object.keys(texts).map(Number).sort((a, b) => a - b)
//       for (const key of keys) {
//         if (texts[key]) {
//           msg += ` ${texts[key]}`
//         }
//       }
//       setTranscript(msg)
//     }
  
//     socket.current.onerror = (event) => {
//       console.error(event)
//       socket.current?.close()
//     }
  
//     socket.current.onclose = (event) => {
//       console.log(event)
//       socket.current = null
//     }
  
//     socket.current.onopen = async () => {
//       const { granted } = await Audio.requestPermissionsAsync()
//       if (!granted) {
//         console.error('Audio permission not granted')
//         return
//       }
  
//       const recording = new Audio.Recording()
//       try {
//         await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
//         recording.setOnRecordingStatusUpdate((status) => {
//           if (status.isRecording) {
//             recorder.current = recording
//           }
//         })
//         await recording.startAsync()
//         setRecordingInstance(recording)
//       } catch (error) {
//         console.error('Failed to start recording:', error)
//       }
//     }
  
//     setIsRecording(true)
//   }
  
//   const endTranscription = async () => {
//     setIsRecording(false)

//     if (socket.current) {
//       socket.current.send(JSON.stringify({ terminate_session: true }))
//       socket.current.close()
//       socket.current = null
//     }

//     if (recorder.current) {
//       try {
//         await recorder.current.stopAndUnloadAsync()
//         const uri = recorder.current.getURI()

//         if (!uri) {
//           console.error('No URI found for the recorded audio')
//           return
//         }

//         const audioFile = await fetch(uri)
//         const audioBlob = await audioFile.blob()

//         const reader = new FileReader()
//         reader.onload = () => {
//           if (reader.result) {
//             const base64data = (reader.result as string).split('base64,')[1]
//             if (socket.current) {
//               socket.current.send(JSON.stringify({ audio_data: base64data }))
//             }
//           }
//         }
//         reader.readAsDataURL(audioBlob)

//         setRecordingInstance(null)
//         recorder.current = null
//       } catch (error) {
//         console.error('Error stopping recording:', error)
//       }
//     }
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text style={{ fontSize: 20, marginBottom: 20 }}>
//         Real-Time Medical Transcription
//       </Text>
//       {isRecording ? (
//         <Button title="Stop Recording" onPress={endTranscription} />
//       ) : (
//         <Button title="Start Recording" onPress={generateTranscript} />
//       )}
//       <Text style={{ marginTop: 20 }}>{transcript}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 24,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   textInput: {
//     height: 50,
//     borderColor: 'gray',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     backgroundColor: '#f9f9f9', // Optional: Add a background color for better visibility
//   },
//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });

// export default SpeechToText;
