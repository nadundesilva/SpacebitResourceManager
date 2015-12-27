<?php

namespace AppBundle\Utils;

class LoginAuthenticator
{
    public function authenticateGuestLogin($session, $connection)
    {
        return $this->authenticateUser(0, $session, $connection);
    }

    public function authenticateStudentLogin($session, $connection)
    {
        return $this->authenticateUser(1, $session, $connection);
    }

    public function authenticateStaffLogin($session, $connection)
    {
        return $this->authenticateUser(2, $session, $connection);
    }

    public function authenticateLowLevelAdminLogin($session, $connection)
    {
        return $this->authenticateUser(3, $session, $connection);
    }

    public function authenticateMiddleLevelAdminLogin($session, $connection)
    {
        return $this->authenticateUser(4, $session, $connection);
    }

    public function authenticateHighLevelAdminLogin($session, $connection)
    {
        return $this->authenticateUser(5, $session, $connection);
    }

    private function authenticateUser($authenticated_access_level, $session, $connection)
    {
        $access_level = $session->get('access_level');
        $user_id = $session->get('user_id');

        if ($access_level >= $authenticated_access_level) {
            $stmt = $connection->prepare('SELECT access_level FROM login INNER JOIN user USING(user_id) WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();

            if ($access_level != $stmt->fetch()['access_level']) {
                $session->invalidate();
                return false;
            }

        } else {
            $session->invalidate();
            return false;
        }
        return true;
    }
}
