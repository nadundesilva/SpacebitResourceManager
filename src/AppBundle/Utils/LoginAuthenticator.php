<?php

namespace AppBundle\Utils;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\Session\Session;

class LoginAuthenticator
{
    private $session;
    private $connection;

    public function __construct(Session $session, Connection $connection)
    {
        $this->session = $session;
        $this->connection = $connection;
    }

    public function authenticateGuestLogin()
    {
        return $this->authenticateUser(0);
    }

    public function authenticateStudentLogin()
    {
        return $this->authenticateUser(1);
    }

    public function authenticateStaffLogin()
    {
        return $this->authenticateUser(2);
    }

    public function authenticateLowLevelAdminLogin()
    {
        return $this->authenticateUser(3);
    }

    public function authenticateMiddleLevelAdminLogin()
    {
        return $this->authenticateUser(4);
    }

    public function authenticateHighLevelAdminLogin()
    {
        return $this->authenticateUser(5);
    }

    private function authenticateUser($authenticated_access_level)
    {
        $access_level = $this->session->get('access_level');
        $user_id = $this->session->get('user_id');

        if (isset($access_level) && $access_level >= $authenticated_access_level) {
            $stmt = $this->connection->prepare('SELECT access_level FROM login INNER JOIN user USING(user_id) WHERE user_id = :user_id AND active = true;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();

            if ($access_level != $stmt->fetch()['access_level']) {
                $this->session->invalidate();
                return false;
            }

        } else {
            $this->session->invalidate();
            return false;
        }
        return true;
    }
}
