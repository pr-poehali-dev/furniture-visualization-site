import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту juliebel@bk.ru"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'})
        }

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    sender = 'juliebel@bk.ru'
    recipient = 'juliebel@bk.ru'

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 32px; border-radius: 8px;">
        <h2 style="color: #1a1714; border-bottom: 2px solid #C9A96E; padding-bottom: 12px; margin-bottom: 24px;">
            Новая заявка с сайта FORMA
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #888; width: 120px; vertical-align: top;">Имя</td>
                <td style="padding: 10px 0; color: #1a1714; font-weight: 600;">{name}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #888; vertical-align: top;">Телефон</td>
                <td style="padding: 10px 0; color: #1a1714; font-weight: 600;">{phone}</td>
            </tr>
            {"<tr><td style='padding: 10px 0; color: #888; vertical-align: top;'>Email</td><td style='padding: 10px 0; color: #1a1714;'>" + email + "</td></tr>" if email else ""}
            {"<tr><td style='padding: 10px 0; color: #888; vertical-align: top;'>Сообщение</td><td style='padding: 10px 0; color: #1a1714;'>" + message + "</td></tr>" if message else ""}
        </table>
        <p style="margin-top: 24px; color: #aaa; font-size: 12px;">
            Заявка отправлена с сайта forma-furniture.ru
        </p>
    </div>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка: {name} — {phone}'
    msg['From'] = sender
    msg['To'] = recipient
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }
