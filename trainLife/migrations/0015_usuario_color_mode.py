# Generated manually for color_mode field addition

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trainLife', '0014_remove_ruta_usuario_ruta_usuarios'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='color_mode',
            field=models.CharField(
                choices=[
                    ('normal', 'Normal'),
                    ('protanopia', 'Protanopia (Rojo-Verde)'),
                    ('deuteranopia', 'Deuteranopia (Rojo-Verde)'),
                    ('tritanopia', 'Tritanopia (Azul-Amarillo)'),
                    ('high_contrast', 'Alto Contraste')
                ],
                default='normal',
                max_length=20,
                verbose_name='Modo de Color'
            ),
        ),
    ]
