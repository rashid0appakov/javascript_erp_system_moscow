export function etoi(ext){
    switch(ext){
        case 'pdf': return 'mdi-file-pdf'
        case 'txt': return 'mdi-file-document'
        case 'xls': case 'xlsx': return 'mdi-file-excel'
        case 'doc': case 'docx': return 'mdi-file-word'
        case 'jpg': case 'jpeg': case 'bmp': case 'png': case 'gif': return 'mdi-file-image'
        default: return 'mdi-file'
    }
}