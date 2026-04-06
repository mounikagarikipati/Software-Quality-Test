from flask import Flask, request, jsonify

app = Flask(__name__)

triangles = []
id_counter = 1

def check_triangle(a, b, c):
    if a <= 0 or b <= 0 or c <= 0:
        return "Invalid"

    if a + b <= c or a + c <= b or b + c <= a:
        return "Invalid"

    if a == b == c:
        return "Equilateral"
    elif a == b or b == c or a == c:
        return "Isosceles"
    else:
        return "Scalene"

@app.route('/triangles', methods=['GET'])
def get_triangles():
    return jsonify(triangles)

@app.route('/triangles', methods=['POST'])
def create_triangle():
    global id_counter
    data = request.json

    a = data.get("a")
    b = data.get("b")
    c = data.get("c")

    result = check_triangle(a, b, c)

    triangle = {
        "id": id_counter,
        "a": a,
        "b": b,
        "c": c,
        "type": result
    }

    triangles.append(triangle)
    id_counter += 1

    return jsonify(triangle)

@app.route('/triangles/<int:id>', methods=['GET'])
def get_triangle(id):
    for t in triangles:
        if t["id"] == id:
            return jsonify(t)
    return jsonify({"error": "Triangle not found"}), 404

@app.route('/triangles/<int:id>', methods=['DELETE'])
def delete_triangle(id):
    global triangles
    triangles = [t for t in triangles if t["id"] != id]
    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    app.run(debug=True)