# Generated by Django 5.0.5 on 2024-05-10 12:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('App1', '0003_choiceresponse_previous_choice'),
    ]

    operations = [
        migrations.RenameField(
            model_name='choiceresponse',
            old_name='previous_choice',
            new_name='previous_choices',
        ),
    ]
