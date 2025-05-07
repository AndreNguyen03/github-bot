// Hàm kiểm tra file có phải là mã nguồn không
export function isCodeFile(filename: string): boolean {
    const codeExtensions = [
      // Các loại file phổ biến cho các ngôn ngữ lập trình khác
      /\.ts$/,      // TypeScript
      /\.js$/,      // JavaScript
      /\.jsx$/,     // JavaScript (React)
      /\.tsx$/,     // TypeScript (React)
      /\.py$/,      // Python
      /\.java$/,    // Java
      /\.go$/,      // Go
      /\.rb$/,      // Ruby
      /\.php$/,     // PHP
      /\.cpp$/,     // C++
      /\.h$/,       // Header C++
      /\.html$/,    // HTML
      /\.css$/,     // CSS
      /\.scss$/,    // SCSS
      /\.sass$/,    // SASS
      /\.json$/,    // JSON
      /\.yaml$/,    // YAML
      /\.yml$/,     // YAML
      /\.xml$/,     // XML
      /\.lua$/,     // Lua
      /\.swift$/,   // Swift
      /\.rust$/,    // Rust
      /\.kt$/,      // Kotlin
      /\.cs$/,      // C#
      /\.sql$/,     // SQL
    ];
  
    // Kiểm tra xem file có đuôi phù hợp không
    return codeExtensions.some(pattern => pattern.test(filename));
  }
  
  // Kiểm tra các loại file không phải mã nguồn (file cấu hình, test, tài liệu...)
export function isNonCodeFile(filename: string): boolean {
    const nonCodePatterns = [
      /\.config\.(ts|js)$/,  // file cấu hình
      /webpack.*\.js$/,      // webpack config
      /\.test\.(ts|js)$/,    // test files
      /\.spec\.(ts|js)$/,    // spec files
      /\.json$/,             // JSON file
      /\.md$/,               // markdown files
      /\.yml$/,              // YAML configuration
      /\.lock$/,             // lock files (package-lock.json, yarn.lock)
      /\.txt$/,              // file văn bản
      /\.md$/,               // file markdown
    ];
    
    return nonCodePatterns.some(pattern => pattern.test(filename));
  }
  