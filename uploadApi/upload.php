<?php 
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header('Content-Type: application/json; charset=utf-8');


function baseUrl(){
  return sprintf(
    "%s://%s%s",
    isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
    $_SERVER['SERVER_NAME'],
    NULL
  );
}

function get_extension($imagetype)
{
   if(empty($imagetype)) return false;
   switch($imagetype)
   {
       case 'image/bmp': return '.bmp';
       case 'image/cis-cod': return '.cod';
       case 'image/gif': return '.gif';
       case 'image/ief': return '.ief';
       case 'image/jpeg': return '.jpg';
       case 'image/pipeg': return '.jfif';
       case 'image/tiff': return '.tif';
       case 'image/x-cmu-raster': return '.ras';
       case 'image/x-cmx': return '.cmx';
       case 'image/x-icon': return '.ico';
       case 'image/x-portable-anymap': return '.pnm';
       case 'image/x-portable-bitmap': return '.pbm';
       case 'image/x-portable-graymap': return '.pgm';
       case 'image/x-portable-pixmap': return '.ppm';
       case 'image/x-rgb': return '.rgb';
       case 'image/x-xbitmap': return '.xbm';
       case 'image/x-xpixmap': return '.xpm';
       case 'image/x-xwindowdump': return '.xwd';
       case 'image/png': return '.png';
       case 'image/x-jps': return '.jps';
       case 'image/x-freehand': return '.fh';
       default: return false;
   }
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE); //convert JSON into array

$response = [];
$upload_dir = 'uploads/';

if(!empty($input['image']))
{
		$pos  = strpos($input['image'], ';');
		$type = explode(':', substr($input['image'], 0, $pos))[1];
		$ext = get_extension($type);

		if (preg_match('/^data:image\/(\w+);base64,/', $input['image'], $type)) {
		    $data = substr($input['image'], strpos($input['image'], ',') + 1);
		    $type = strtolower($type[1]);
		    if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
		    	$response = array(
			        "status" => "error",
			        "error" => true,
			        "message" => 'invalid image type'
			    );
			    echo json_encode($response); exit;
		    }

		    $data = base64_decode($data);

		    if ($data === false) {
		    	$response = array(
			        "status" => "error",
			        "error" => true,
			        "message" => 'base64_decode failed'
			    );
			    echo json_encode($response); exit;
		    }
		} else {
			$response = array(
			        "status" => "error",
			        "error" => true,
			        "message" => 'did not match data URI with image data'
			    );
			echo json_encode($response); exit;
		}
		$name = generateRandomString(10).time().$ext;
		file_put_contents("uploads/".$name, $data);
		$response = array(
	        "status" => "success",
	        "error" => false,
	        "message" => "File uploaded successfully",
	        "url" => baseUrl()."/uploadApi/uploads/".$name
	      );
}else{
    $response = array(
        "status" => "error",
        "error" => true,
        "message" => "No file was sent!"
    );
}

echo json_encode($response);
?>