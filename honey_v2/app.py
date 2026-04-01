from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/flames', methods=['POST'])
def flames():
    data = request.json
    name1 = data.get('name1', '').strip()
    name2 = data.get('name2', '').strip()

    n1 = name1.lower().replace(' ', '')
    n2 = name2.lower().replace(' ', '')

    special = (
        ('abubakar' in n1 or 'abubakkar' in n1 or 'siddiq' in n1) and 'fasheeha' in n2
    ) or (
        ('abubakar' in n2 or 'abubakkar' in n2 or 'siddiq' in n2) and 'fasheeha' in n1
    )

    if special:
        return jsonify({'result': 'Marriage', 'emoji': '💍', 'msg': 'Destined to be together forever! 💍🥹', 'special': True})

    combined = (name1 + name2).lower().replace(' ', '')
    count = len(combined)
    flames_list = [
        {'r': 'Friends', 'e': '🤝', 'm': 'Great friends forever!'},
        {'r': 'Love', 'e': '💖', 'm': 'Pure love between you two!'},
        {'r': 'Affection', 'e': '🌸', 'm': 'Deep affection and warmth!'},
        {'r': 'Marriage', 'e': '💍', 'm': 'Destined to be together!'},
        {'r': 'Enemies', 'e': '⚡', 'm': 'Opposites attract maybe?'},
        {'r': 'Siblings', 'e': '👫', 'm': 'Bonded like family!'},
    ]
    idx = (count % 6) - 1
    if idx < 0: idx = 5
    f = flames_list[idx]
    return jsonify({'result': f['r'], 'emoji': f['e'], 'msg': f['m'], 'special': False})

if __name__ == '__main__':
    app.run(debug=True)
