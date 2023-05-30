from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from .utils import *



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
            bytes = content.read()
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
            translated_text = translate_to_chosen_language(
                text_en=text_en, translate_to_language=target_language.lower())
            voice_blob_file = convert_translated_text_to_speech(
                translated_text=translated_text,translate_to_language=target_language.lower() )
            voice_blob_file.seek(0)
            byteData = voice_blob_file.read()
            b64 = convert_blob_to_base64(byteData=byteData)
           
            
            return Response({"msg": b64}, status=status.HTTP_200_OK)
        return Response({"msg": "it does not work"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"msg": "not allowed"}, status=status.HTTP_403_FORBIDDEN)
