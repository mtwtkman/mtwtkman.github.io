# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-14 22:25
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20170413_2116'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tag',
            name='id',
        ),
        migrations.AlterField(
            model_name='article',
            name='body',
            field=models.TextField(validators=[django.core.validators.MinLengthValidator(1)]),
        ),
        migrations.AlterField(
            model_name='article',
            name='slug',
            field=models.CharField(max_length=80, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
        migrations.AlterField(
            model_name='article',
            name='title',
            field=models.CharField(max_length=50, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
        migrations.AlterField(
            model_name='tag',
            name='name',
            field=models.CharField(max_length=15, primary_key=True, serialize=False, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
    ]
