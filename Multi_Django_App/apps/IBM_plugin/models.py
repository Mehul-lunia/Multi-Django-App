from django.db import models

class BlobStorage(models.Model):
    target_language = models.CharField(max_length=25)
    english_input = models.CharField(max_length=300)
    english_blob = models.BinaryField()
    translated_blob = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)
