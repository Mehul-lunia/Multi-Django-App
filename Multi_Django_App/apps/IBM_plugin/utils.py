from ibm_watson import TextToSpeechV1
from ibm_watson import LanguageTranslatorV3
from ibm_watson import SpeechToTextV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import io



global_lang_dict = {
     "french":{"target":"fr","voice":"fr-FR_ReneeV3Voice"},
     "german":{"target":"de","voice":"de-DE_DieterV3Voice"},
     "spanish":{"target":"es","voice":"es-ES_LauraV3Voice"},
     "brazilian_portugese":{"target":"pt","voice":"pt-BR_IsabelaV3Voice"},
     "dutch":{"target":"nl","voice":"nl-NL_MerelV3Voice"},
     "japanese":{"target":"ja","voice":"ja-JP_EmiV3Voice"},
     "italian":{"target":"it","voice":"it-IT_FrancescaV3Voice"}
}


# Set up authentication for text to speech
authenticator = IAMAuthenticator('MChdJg-PsUBNKFixn0NQVaWkB8iQiza-_hyBgwvkw8zm')
tts = TextToSpeechV1(authenticator=authenticator)
tts.set_service_url('https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/6abfa2e8-2ed5-4af0-ab34-229ae49fe8e5')


def translate_to_chosen_language(text_en,translate_to_language):
    #set up authentication for language translate
    authenticator = IAMAuthenticator('el32AdjhyUDqjwlVZ4thvztJ0jpw6dEUSnH5aCHib9YL')
    lt = LanguageTranslatorV3(version='2018-05-01', authenticator=authenticator)
    lt.set_service_url('https://api.us-south.language-translator.watson.cloud.ibm.com/instances/24d376aa-0fcd-491c-b377-8eb8e167b40e')


    #Translating the text to french text and storing in text_fr
    translation = lt.translate(
    text=text_en,
    source='en',
    target=global_lang_dict[translate_to_language]["target"]
    ).get_result()

    translated_text = translation['translations'][0]['translation']
    return translated_text


def convert_translated_text_to_speech(translated_text,translate_to_language):
    blob = io.BytesIO()
    response = tts.synthesize(translated_text, accept='audio/mp3', voice= global_lang_dict[translate_to_language]["voice"]).get_result()
    blob.write(response.content)
    return blob


import base64

def convert_blob_to_base64(byteData):
        base64_data = base64.b64encode(byteData).decode('utf-8')
        return base64_data



    
    