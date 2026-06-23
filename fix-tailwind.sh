#!/bin/bash

TARGET_DIR="./frontend/app"

echo "🚀 Iniciando limpieza total en carpetas raíz y admin de QuickEats..."

if [ ! -d "$TARGET_DIR" ]; then
  echo "❌ Error: Ruta no encontrada."
  exit 1
fi

# 1. Reemplazo profundo de Gradientes Lineales
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/bg-gradient-to-br/bg-linear-to-br/g' {} +
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/bg-gradient-to-r/bg-linear-to-r/g' {} +
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i 's/bg-gradient-to-b/bg-linear-to-b/g' {} +

# 2. Reemplazo profundo de Dimensiones y Contenedores
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/max-w-\[1400px\]/max-w-350/g' {} +
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/left-\[11px\]/left-2.75/g' {} +
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/w-\[2px\]/w-0.5/g' {} +
find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/-left-\[29px\]/-left-7.25/g' {} +

echo "✅ ¡Limpieza de la rama feature/mango-ui-consistency terminada, Mathias!"
