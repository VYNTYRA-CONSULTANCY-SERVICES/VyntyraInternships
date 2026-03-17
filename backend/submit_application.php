<?php

declare(strict_types=1);

$host = getenv('NEON_HOST') ?: 'your-neon-host.neon.tech';
$port = getenv('NEON_PORT') ?: '5432';
$database = getenv('NEON_DATABASE') ?: 'internship';
$user = getenv('NEON_USER') ?: 'your-neon-user';
$password = getenv('NEON_PASSWORD') ?: 'your-super-secret-password';
$dsn = "pgsql:host=$host;port=$port;dbname=$database;sslmode=require";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $password, $options);
} catch (PDOException $exception) {
    http_response_code(500);
    echo "<h1>Database unavailable</h1>";
    echo "<p>Could not connect to the Neon PostgreSQL cluster. Please try again later.</p>";
    exit;
}

$required = [
    'full_name',
    'phone',
    'email',
    'college_name',
    'college_location',
    'preferred_domain',
    'languages',
    'remote_comfort',
    'placement_contact',
];

foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo "<p>Missing submission data: $field</p>";
        exit;
    }
}

if (!isset($_POST['consent'])) {
    http_response_code(400);
    echo "<p>You must consent to data processing before applying.</p>";
    exit;
}

$fullName = trim((string) $_POST['full_name']);
$phone = trim((string) $_POST['phone']);
$email = trim((string) $_POST['email']);
$collegeName = trim((string) $_POST['college_name']);
$collegeLocation = trim((string) $_POST['college_location']);
$preferredDomain = trim((string) $_POST['preferred_domain']);
$languages = trim((string) $_POST['languages']);
$remoteComfort = trim((string) $_POST['remote_comfort']);
$placementContact = trim((string) $_POST['placement_contact']);
$consent = 1;
$resumePath = null;

if (!empty($_FILES['resume']['name']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $safeName = bin2hex(random_bytes(6)) . '-' . basename($_FILES['resume']['name']);
    $targetPath = $uploadDir . DIRECTORY_SEPARATOR . $safeName;

    if (move_uploaded_file($_FILES['resume']['tmp_name'], $targetPath)) {
        $resumePath = 'uploads/' . $safeName;
    }
}

$sql = "INSERT INTO internship_applications
    (full_name, phone, email, college_name, college_location, preferred_domain, languages, remote_comfort, placement_contact, resume_path, consent)
    VALUES (:full_name, :phone, :email, :college_name, :college_location, :preferred_domain, :languages, :remote_comfort, :placement_contact, :resume_path, :consent)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':full_name' => $fullName,
    ':phone' => $phone,
    ':email' => $email,
    ':college_name' => $collegeName,
    ':college_location' => $collegeLocation,
    ':preferred_domain' => $preferredDomain,
    ':languages' => $languages,
    ':remote_comfort' => $remoteComfort,
    ':placement_contact' => $placementContact,
    ':resume_path' => $resumePath,
    ':consent' => $consent,
]);

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Application Submitted</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Space Grotesk", system-ui, sans-serif;
        background: radial-gradient(circle, #5d2cff 0%, #0a0c1f 60%);
        color: #fff;
        text-align: center;
        padding: 2rem;
      }
      a {
        color: #3ae6c3;
        text-decoration: none;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>Thank you for applying!</h1>
      <p>Your submission has been recorded. We will respond within five working days.</p>
      <p><a href="/">Return to the prospectus</a></p>
    </div>
  </body>
</html>
