from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from .utils import *
from .models import BlobStorage



@api_view(['GET', 'POST'])
def index(request):
    return Response({"msg": "it works!!"}, status=status.HTTP_200_OK)




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
    eng_b64_list = []
    translated_b64_list = []
    # print(Last5Blobs[4:5][0]["english_blob"])
    if Last5Blobs is not None:
        for i in range(5):
            english_byte_data = Last5Blobs[i:i+1][0]["english_blob"]
            translated_byte_data = Last5Blobs[i:i+1][0]["translated_blob"]
            target_language = Last5Blobs[i:i+1][0]["target_language"]
            english_input = Last5Blobs[i:i+1][0]["english_input"]
            eng_b64 = convert_blob_to_base64(byteData=english_byte_data)
            # eng_b64_list.append(eng_b64)
            translated_b64 = convert_blob_to_base64(byteData=translated_byte_data)
            # translated_b64_list.append(translated_b64)
            b64_dict[i] = {"eng_b64":eng_b64,"translated_b64":translated_b64,"target_language":target_language,"english_input":english_input}
        # print(b64_dict[0]["eng_b64"])

        return Response(b64_dict,status=status.HTTP_200_OK)
    return Response({"msg":"some error occured"},status=status.HTTP_400_BAD_REQUEST)


