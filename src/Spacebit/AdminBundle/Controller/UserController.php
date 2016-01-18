<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    function usersAction()
    {
        if (!$this->get('login_authenticator')->authenticateMiddleLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM user ORDER BY active DESC;');
        $stmt->bindValue(':access_level', $this->get('session')->get('access_level'));
        $stmt->execute();
        $users = $stmt->fetchAll();

        return $this->render('SpacebitAdminBundle:Default:users.html.twig', array(
            'users'=>$users,
        ));
    }

    function activateAction()
    {
        if (!$this->get('login_authenticator')->authenticateMiddleLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');
        $active = ($request->request->get('status') == "true" ? 1 : 0);

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('UPDATE user SET active = :active WHERE user_id = :user_id;');
        $stmt->bindValue(':active', $active);
        $stmt->bindValue(':user_id', $user_id);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

    function changeAccessLevelAction()
    {
        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');
        $access_level = $request->request->get('access-level');

        $session = $this->get('session');
        $logged_in_user_id = $session->get('user_id');
        $logged_in_access_level = $session->get('access_level');

        if (!$this->get('login_authenticator')->authenticateMiddleLevelAdminLogin() || ($access_level < $logged_in_access_level && $logged_in_access_level != 5) || $logged_in_user_id == $user_id) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('UPDATE user SET access_level = :access_level WHERE user_id = :user_id;');
        $stmt->bindValue(':access_level', $access_level);
        $stmt->bindValue(':user_id', $user_id);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

    function getDetailsAction()
    {
        if (!$this->get('login_authenticator')->authenticateMiddleLevelAdminLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT first_name, middle_name, last_name, email, telephone_no, access_level FROM user WHERE user_id = :user_id;');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $user = $stmt->fetch();

        if($user['access_level'] == 0) {
            $stmt = $conn->prepare('SELECT nic, address, organizational_title, organizational_email, organizational_telephone FROM guest WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['nic'] = $result['nic'];
            $user['address'] = $result['address'];
            $user['organizational_title'] = $result['organizational_title'];
            $user['organizational_email'] = $result['organizational_email'];
            $user['organizational_telephone'] = $result['organizational_telephone'];
        } else if ($user['access_level'] == 1) {
            $stmt = $conn->prepare('SELECT dept_name, batch FROM student WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['dept_name'] = $result['dept_name'];
            $user['batch'] = $result['batch'];
        } else {
            $stmt = $conn->prepare('SELECT dept_name, designation FROM staff WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['dept_name'] = $result['dept_name'];
            $user['designation'] = $result['designation'];
        }

        $response = new Response(json_encode(array('result' => $user)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    function getAdminRightsAction() {
        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');
        $logged_in_user_id = $this->get('session')->get('user_id');

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('SELECT access_level FROM login INNER JOIN user USING(user_id) WHERE user_id = :user_id;');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $access_level = $stmt->fetch()['access_level'];

        $stmt = $conn->prepare('SELECT access_level FROM login INNER JOIN user USING(user_id) WHERE user_id = :user_id;');
        $stmt->bindValue(':user_id', $logged_in_user_id);
        $stmt->execute();
        $logged_in_access_level = $stmt->fetch()['access_level'];

        if (!$this->get('login_authenticator')->authenticateMiddleLevelAdminLogin() || ($access_level < $logged_in_access_level && $logged_in_access_level != 5)) {
            return new RedirectResponse($this->generateUrl('spacebit_user_login'));
        }

        $stmt = $conn->prepare('SELECT resource.resource_id AS resource_id, equipment_type FROM (equipment INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id) WHERE user_id = :user_id');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $equipment_administration = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT resource.resource_id AS resource_id, venue_type FROM (venue INNER JOIN resource USING(resource_id)) INNER JOIN resource_administration USING(resource_id) WHERE user_id = :user_id');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $venue_administration = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT vehicle.plate_no AS plate_no, type FROM vehicle INNER JOIN vehicle_administration USING(plate_no) WHERE user_id = :user_id');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $vehicle_administration = $stmt->fetchAll();

        $response = new Response(json_encode(array(
            'equipment_administration' => $equipment_administration,
            'venue_administration' => $venue_administration,
            'vehicle_administration' => $vehicle_administration,
        )));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
