from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from .utils import *
from .models import BlobStorage
from requests import post,get
from rev_ai import apiclient
import time



@api_view(['GET', 'POST'])
def index(request):
    return Response({"msg": "it works!!"}, status=status.HTTP_200_OK)

# token = "022a_xS7vSwcS6JslYx5w_gdbSmh_moY-pKs4C8gn6fsGxVPVR6fLLgjqq3pPseM12QR2SOv6Y8c4Lhxag-8bw6E1QOTI"
# client = apiclient.RevAiAPIClient(token)



@api_view(['GET','POST'])
def abc(request):
    if request.method == 'POST':
        blob = request.FILES["audio_url"]
        with open('static/temp_file.wav','wb') as f:
            f.write(blob.read())

        get_id_url = 'https://api.rev.ai/speechtotext/v1/jobs'
        payload = 'static/temp_file.wav'
        get_id_headers = {"Authorization": "Bearer 022a_xS7vSwcS6JslYx5w_gdbSmh_moY-pKs4C8gn6fsGxVPVR6fLLgjqq3pPseM12QR2SOv6Y8c4Lhxag-8bw6E1QOTI",
                   "Content-Type": "multipart/form-data"}
        
        #making the post request:
        res = post(url=get_id_url,headers=get_id_headers,data=payload)
        print(res.json())
        id = res.json()['id']
        url = f"https://api.rev.ai/speechtotext/v1/jobs/{id}"

        headers = {"Authorization": "Bearer 022a_xS7vSwcS6JslYx5w_gdbSmh_moY-pKs4C8gn6fsGxVPVR6fLLgjqq3pPseM12QR2SOv6Y8c4Lhxag-8bw6E1QOTI"}


        while True:
            request = get(url=url,headers=headers)
            response = request.raise_for_status()

            status = request.json()["status"]

            if status == 'transcribed':
                print("transcription completed")
                get_transcript_url = f"https://api.rev.ai/speechtotext/v1/jobs/{id}/transcript"
                get_transcript_headers = {"Authorization": "Bearer 022a_xS7vSwcS6JslYx5w_gdbSmh_moY-pKs4C8gn6fsGxVPVR6fLLgjqq3pPseM12QR2SOv6Y8c4Lhxag-8bw6E1QOTI",
                                          "Accept": "application/vnd.rev.transcript.v1.0+json"}
                transcript = get(url=get_transcript_url,headers=get_transcript_headers)
                result = transcript.json()
                return Response({"msg":result},status=status.HTTP_200_OK)


            elif status in ["in_progress","queued"]:
                print("Transcription job yet to be completed, waiting...")
                time.sleep()
            
            else:
                print("Transcription failed!")
                return Response({"msg":"abc"},status=status.HTTP_204_NO_CONTENT)
                




        
       

@api_view(['GET','POST'])
def efg(request):
    token = "022a_xS7vSwcS6JslYx5w_gdbSmh_moY-pKs4C8gn6fsGxVPVR6fLLgjqq3pPseM12QR2SOv6Y8c4Lhxag-8bw6E1QOTI"
    client = apiclient.RevAiAPIClient(token)
    id = request.GET.get("id")
    job_details = client.get_job_details(id)
    if job_details == "transcribed":
        transcript_json = client.get_transcript_json(id)
        return Response(transcript_json,status=status.HTTP_200_OK)
    return Response({"msg":"not yet transcribed"},status=status.HTTP_204_NO_CONTENT)
    # return Response({"msg":"no transcribtion"},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)






@api_view(['GET', 'POST'])
def execute(request):
    if request.method == 'POST':
        content = request.FILES['recording']
        target_language = request.POST.get('target_language')
        print(target_language)
        if content is not None:
            blobObject = BlobStorage()
            blobObject.target_language = target_language
            bytes = content.read()
            blobObject.english_blob = bytes
            # Authenticating with IBM authenticator
            authenticator = IAMAuthenticator(
                '4g1s4nZlqMtmi-jcGpbqhUcow3L8z11zb6H_CeyYntzB')
            speech_to_text = SpeechToTextV1(authenticator=authenticator)
            speech_to_text.set_service_url(
                'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/b736c1c8-c0eb-4a2d-8f01-02e000df7fc5')
            # passing in the byte data of the audio
            speech_recognition_results = speech_to_text.recognize(
                audio=bytes
            ).get_result()
            # getting the text in english
            text_en = speech_recognition_results['results'][0]['alternatives'][0]['transcript']
            print(text_en)
            blobObject.english_input = text_en
            translated_text = translate_to_chosen_language(
                text_en=text_en, translate_to_language=target_language.lower())
            voice_blob_file = convert_translated_text_to_speech(
                translated_text=translated_text,translate_to_language=target_language.lower() )
            voice_blob_file.seek(0)
            byteData = voice_blob_file.read()
            #saving the blob file in database
            if byteData is not None:
                blobObject.translated_blob = byteData
                blobObject.save()
            b64 = convert_blob_to_base64(byteData=byteData)
           
            
            return Response({"msg": b64,"translated_text":translated_text,"eng_text":text_en}, status=status.HTTP_200_OK)
        return Response({"msg": "it does not work"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"msg": "not allowed"}, status=status.HTTP_403_FORBIDDEN)

@api_view(["GET","POST"])
def historicalTranslation(request):
    Last5Blobs = BlobStorage.objects.all().order_by("-id").values()
    b64_dict = {}

    # print(Last5Blobs[4:5][0]["english_blob"])
    if Last5Blobs is not None:
        for i in range(5):
            english_byte_data = Last5Blobs[i:i+1][0]["english_blob"]
            translated_byte_data = Last5Blobs[i:i+1][0]["translated_blob"]
            target_language = Last5Blobs[i:i+1][0]["target_language"]
            english_input = Last5Blobs[i:i+1][0]["english_input"]
            created_at = Last5Blobs[i:i+1][0]["created_at"].strftime("%a %m %y")
            eng_b64 = convert_blob_to_base64(byteData=english_byte_data)
            # eng_b64_list.append(eng_b64)
            translated_b64 = convert_blob_to_base64(byteData=translated_byte_data)
            # translated_b64_list.append(translated_b64)
            b64_dict[i] = {"eng_b64":eng_b64,"translated_b64":translated_b64,"target_language":target_language,"english_input":english_input,"created_at":created_at}
        # print(b64_dict[0]["eng_b64"])

        return Response(b64_dict,status=status.HTTP_200_OK)
    return Response({"msg":"some error occured"},status=status.HTTP_400_BAD_REQUEST)


