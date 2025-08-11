const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build del proyecto...');

// Función para eliminar directorio recursivamente
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Eliminando directorio existente: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Función para crear directorio
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Creando directorio: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función para copiar archivos recursivamente
function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);

    // Excluir directorios y archivos específicos
    if (item === 'public' || item === '.git' || item === 'node_modules' || item === 'build.js') {
      console.log(`⏭️  Excluyendo: ${item}`);
      continue;
    }

    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      console.log(`📁 Copiando directorio: ${item}`);
      copyDirectory(sourcePath, destPath);
    } else {
      console.log(`📄 Copiando archivo: ${item}`);
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Función principal de build
function build() {
  try {
    const publicDir = 'public';

    // Paso 1: Eliminar directorio public si existe
    removeDirectory(publicDir);

    // Paso 2: Crear nuevo directorio public
    createDirectory(publicDir);

    // Paso 3: Copiar archivos del proyecto
    console.log('📋 Copiando archivos del proyecto...');
    copyDirectory('.', publicDir);

    // Paso 4: Verificar que se copiaron los archivos importantes
    const importantFiles = [
      'index.html',
      'login.html',
      'menu.html',
      'game.html',
      'leaderboard.html'
    ];

    console.log('\n✅ Verificando archivos importantes...');
    for (const file of importantFiles) {
      const filePath = path.join(publicDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - OK`);
      } else {
        console.log(`❌ ${file} - NO ENCONTRADO`);
      }
    }

    // Paso 5: Verificar directorios importantes
    const importantDirs = ['css', 'js', 'images', 'soundtrack'];
    console.log('\n✅ Verificando directorios importantes...');
    for (const dir of importantDirs) {
      const dirPath = path.join(publicDir, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        console.log(`✅ ${dir}/ - ${files.length} archivos`);
      } else {
        console.log(`❌ ${dir}/ - NO ENCONTRADO`);
      }
    }

    console.log('\n🎉 Build completado exitosamente!');
    console.log(`📁 Directorio public creado en: ${path.resolve(publicDir)}`);

  } catch (error) {
    console.error('\n❌ Error durante el build:', error.message);
    process.exit(1);
  }
}

// Ejecutar build
build();
