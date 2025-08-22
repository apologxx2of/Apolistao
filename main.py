from flask import Flask, request, jsonify
import json
import hashlib
import random

app = Flask(__name__)
DB_FILE = 'db.json'

# ---------- FUNÇÕES AUXILIARES ----------

# Hash de senha
def hash_senha(senha):
    return hashlib.sha256(senha.encode()).hexdigest()

# Gerar número de conta (8 dígitos, últimos 3 com peso)
def gerar_numero_conta():
    base = [random.randint(0, 9) for _ in range(5)]
    ult3 = [random.randint(0, 9) for _ in range(3)]
    pesos = [7, 3, 1]
    ult3[2] = sum([ult3[i]*pesos[i] for i in range(2)]) % 10
    conta = ''.join(map(str, base + ult3))
    return conta

# Validar número de conta
def validar_numero_conta(conta):
    if len(conta) != 8 or not conta.isdigit():
        return False
    ult3 = [int(conta[5]), int(conta[6]), int(conta[7])]
    pesos = [7, 3, 1]
    return sum([ult3[i]*pesos[i] for i in range(2)]) % 10 == ult3[2]

# Ler DB
def ler_db():
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"usuarios": []}

# Salvar DB
def salvar_db(db):
    with open(DB_FILE, 'w') as f:
        json.dump(db, f, indent=4)

# ---------- ROTAS ----------

# Registrar
@app.route('/registrar', methods=['POST'])
def registrar():
    data = request.json
    if not data or 'username' not in data or 'senha' not in data:
        return jsonify({"erro": "Dados inválidos"}), 400
    db = ler_db()
    if any(u['username'] == data['username'] for u in db['usuarios']):
        return jsonify({"erro": "Usuário já existe"}), 400
    conta = gerar_numero_conta()
    usuario = {
        "username": data['username'],
        "senha": hash_senha(data['senha']),
        "saldo": 0.0,
        "conta": conta
    }
    db['usuarios'].append(usuario)
    salvar_db(db)
    return jsonify({"mensagem": "Registrado com sucesso", "numero_conta": conta})

# Logar
@app.route('/logar', methods=['POST'])
def logar():
    data = request.json
    db = ler_db()
    usuario = next((u for u in db['usuarios'] if u['username'] == data.get('username') and u['senha'] == hash_senha(data.get('senha', ''))), None)
    if usuario:
        return jsonify({"mensagem": "Logado com sucesso", "numero_conta": usuario['conta']})
    return jsonify({"erro": "Usuário ou senha inválidos"}), 401

# Saldo
@app.route('/saldo', methods=['POST'])
def saldo():
    data = request.json
    db = ler_db()
    usuario = next((u for u in db['usuarios'] if u['username'] == data.get('username') and u['senha'] == hash_senha(data.get('senha', ''))), None)
    if usuario:
        return jsonify({"saldo": usuario['saldo']})
    return jsonify({"erro": "Usuário ou senha inválidos"}), 401

# Transferência
@app.route('/transferencia', methods=['POST'])
def transferencia():
    data = request.json
    db = ler_db()
    remetente = next((u for u in db['usuarios'] if u['username'] == data.get('username') and u['senha'] == hash_senha(data.get('senha', ''))), None)
    if not remetente:
        return jsonify({"erro": "Usuário ou senha inválidos"}), 401
    valor = data.get('valor')
    conta_destino = data.get('conta_destino')
    if not valor or not conta_destino:
        return jsonify({"erro": "Dados inválidos"}), 400
    if remetente['saldo'] < valor:
        return jsonify({"erro": "Saldo insuficiente"}), 400
    destinatario = next((u for u in db['usuarios'] if u['conta'] == conta_destino), None)
    if not destinatario or not validar_numero_conta(conta_destino):
        return jsonify({"erro": "Conta de destino inválida"}), 400
    remetente['saldo'] -= valor
    destinatario['saldo'] += valor
    salvar_db(db)
    return jsonify({"mensagem": "Transferência realizada com sucesso"})

# Número da conta
@app.route('/numerodeconta', methods=['POST'])
def numerodeconta():
    data = request.json
    db = ler_db()
    usuario = next((u for u in db['usuarios'] if u['username'] == data.get('username') and u['senha'] == hash_senha(data.get('senha', ''))), None)
    if usuario:
        return jsonify({"numero_conta": usuario['conta']})
    return jsonify({"erro": "Usuário ou senha inválidos"}), 401

# ---------- RODA APP ----------
if __name__ == '__main__':
    app.run(debug=True)
